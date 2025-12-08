"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import {
    MoreHorizontal, Calendar, DollarSign, User,
    Car, Heart, Building, Wallet, Layers,
    Inbox, Zap, CheckCircle2, XCircle, Briefcase, AlertCircle, Clock
} from 'lucide-react';
import DealDetailModal from './DealDetailModal';

// Types
type Deal = {
    id: string;
    title: string;
    value: number | null;
    stage: string;
    priority?: string;
    insuranceType: string;
    contact: { name: string; phone?: string; email?: string };
    insuranceData: any;
    renewalDate?: Date | string;
    createdAt: Date | string;
};

type Stage = {
    id: string;
    name: string;
    color: string;
    order: number;
    type: string;
};

// Priority color mapping
const getPriorityClass = (priority?: string) => {
    switch (priority?.toUpperCase()) {
        case 'HIGH': return 'priority-high';
        case 'MEDIUM': return 'priority-medium';
        case 'LOW': return 'priority-low';
        default: return 'priority-medium';
    }
};

// Icon Mapping Helper
const getStageIcon = (type: string) => {
    switch (type) {
        case 'WON': return CheckCircle2;
        case 'LOST': return XCircle;
        default: return Briefcase;
    }
};

const getStageStyles = (color: string) => {
    const styles: any = {
        blue: { dot: 'bg-blue-500', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
        yellow: { dot: 'bg-yellow-500', text: 'text-yellow-400', glow: 'shadow-yellow-500/20' },
        purple: { dot: 'bg-purple-500', text: 'text-purple-400', glow: 'shadow-purple-500/20' },
        green: { dot: 'bg-green-500', text: 'text-green-400', glow: 'shadow-green-500/20' },
        red: { dot: 'bg-red-500', text: 'text-red-400', glow: 'shadow-red-500/20' },
    };
    return styles[color] || styles.blue;
};

const getInsuranceTag = (type: string) => {
    switch (type?.toUpperCase()) {
        case 'AUTO': return { class: 'tag-cyan', icon: Car };
        case 'SAUDE': return { class: 'tag-red', icon: Heart };
        case 'VIDA': return { class: 'tag-purple', icon: Heart };
        case 'CONSORCIO': return { class: 'tag-yellow', icon: Wallet };
        case 'EMPRESARIAL': return { class: 'tag-green', icon: Building };
        default: return { class: 'tag-cyan', icon: Briefcase };
    }
};

const PIPELINES = [
    { id: 'ALL', label: 'Visão Geral', icon: Layers },
    { id: 'AUTO', label: 'Automóvel', icon: Car },
    { id: 'SAUDE', label: 'Saúde/Vida', icon: Heart },
    { id: 'CONSORCIO', label: 'Consórcio', icon: Wallet },
    { id: 'RAMOS_ELEMENTARES', label: 'Resid/Emp', icon: Building },
];

export default function KanbanBoard({ initialDeals, initialStages = [] }: { initialDeals: Deal[], initialStages?: Stage[] }) {
    const [deals, setDeals] = useState<Deal[]>(initialDeals);
    const [stages, setStages] = useState<Stage[]>(initialStages || []);
    const [activePipeline, setActivePipeline] = useState('ALL');
    const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
    const router = useRouter();

    const filteredDeals = deals.filter(deal => {
        if (activePipeline === 'ALL') return true;
        return deal.insuranceType?.toUpperCase() === activePipeline;
    });

    const getColumnDeals = (colId: string) => filteredDeals.filter((d) => d.stage === colId);

    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, []);

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) return;

        const newStage = destination.droppableId;

        // Optimistic Update
        const updatedDeals = deals.map((d) =>
            d.id === draggableId ? { ...d, stage: newStage } : d
        );
        const previousDeals = [...deals];
        setDeals(updatedDeals);

        try {
            await axios.patch(`/api/deals/${draggableId}`, { stage: newStage });
            router.refresh();
        } catch (error) {
            console.error("Erro ao salvar movimento:", error);
            setDeals(previousDeals);
            alert("Erro ao mover o card. A alteração foi revertida.");
        }
    };

    if (!enabled) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Pipeline Filter Tabs */}
            <div className="flex gap-1 mb-6 px-1 overflow-x-auto pb-3">
                {PIPELINES.map((pipeline) => {
                    const Icon = pipeline.icon;
                    const isActive = activePipeline === pipeline.id;
                    return (
                        <button
                            key={pipeline.id}
                            onClick={() => setActivePipeline(pipeline.id)}
                            className={`
                                flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap
                                ${isActive
                                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent'}
                            `}
                        >
                            <Icon size={16} />
                            {pipeline.label}
                        </button>
                    );
                })}
            </div>

            {/* Kanban Board */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex-1 overflow-x-auto">
                    <div className="flex gap-5 h-full min-w-max pb-4 px-1">
                        {stages.map((stage) => {
                            const style = getStageStyles(stage.color);
                            const columnDeals = getColumnDeals(stage.id);

                            return (
                                <div key={stage.id} className="kanban-column flex flex-col">
                                    {/* Column Header - Floating Style */}
                                    <div className="kanban-column-header">
                                        <div className={`w-2.5 h-2.5 rounded-full ${style.dot} shadow-lg ${style.glow}`} />
                                        <h3 className={`font-semibold text-sm ${style.text}`}>
                                            {stage.name}
                                        </h3>
                                        <span className="ml-auto text-xs font-mono text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">
                                            {columnDeals.length}
                                        </span>
                                    </div>

                                    {/* Droppable Area */}
                                    <Droppable droppableId={stage.id}>
                                        {(provided, snapshot) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className={`
                                                    flex-1 rounded-2xl p-2 min-h-[200px] transition-all duration-200
                                                    ${snapshot.isDraggingOver
                                                        ? 'bg-cyan-500/5 ring-1 ring-cyan-500/20'
                                                        : 'bg-transparent'}
                                                `}
                                            >
                                                <AnimatePresence mode='popLayout'>
                                                    {columnDeals.map((deal, index) => {
                                                        const tagInfo = getInsuranceTag(deal.insuranceType);
                                                        const TagIcon = tagInfo.icon;

                                                        return (
                                                            <Draggable key={deal.id} draggableId={deal.id} index={index}>
                                                                {(provided, snapshot) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        className="mb-3 outline-none"
                                                                        style={{ ...provided.draggableProps.style }}
                                                                    >
                                                                        <div
                                                                            className={`
                                                                                kanban-card ${getPriorityClass(deal.priority)} group
                                                                                ${snapshot.isDragging
                                                                                    ? 'rotate-2 scale-105 shadow-2xl shadow-cyan-500/20 ring-2 ring-cyan-500/50'
                                                                                    : ''}
                                                                            `}
                                                                            onClick={() => setSelectedDeal(deal)}
                                                                        >
                                                                            {/* Header: Tag + Actions */}
                                                                            <div className="flex justify-between items-start mb-3">
                                                                                <span className={`tag ${tagInfo.class}`}>
                                                                                    <TagIcon size={10} className="mr-1" />
                                                                                    {deal.insuranceType}
                                                                                </span>
                                                                                <button className="p-1 rounded-lg text-gray-600 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all">
                                                                                    <MoreHorizontal size={14} />
                                                                                </button>
                                                                            </div>

                                                                            {/* Title */}
                                                                            <h4 className="font-medium text-white text-sm mb-3 leading-relaxed line-clamp-2">
                                                                                {deal.title}
                                                                            </h4>

                                                                            {/* Renewal Alert */}
                                                                            {deal.renewalDate && (
                                                                                <div className={`
                                                                                    mb-3 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase 
                                                                                    flex items-center gap-1.5 w-fit
                                                                                    ${new Date(deal.renewalDate) < new Date()
                                                                                        ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                                                                                        : 'bg-orange-500/10 text-orange-400 border border-orange-500/15'}
                                                                                `}>
                                                                                    <Clock size={10} />
                                                                                    Renova: {new Date(deal.renewalDate).toLocaleDateString('pt-BR')}
                                                                                </div>
                                                                            )}

                                                                            {/* Footer: Contact + Value */}
                                                                            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                                                                <div className="flex items-center gap-2">
                                                                                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-[9px] font-bold text-cyan-400">
                                                                                        {deal.contact.name.substring(0, 2).toUpperCase()}
                                                                                    </div>
                                                                                    <span className="text-xs text-gray-500 truncate max-w-[80px]">
                                                                                        {deal.contact.name.split(' ')[0]}
                                                                                    </span>
                                                                                </div>

                                                                                {deal.value && (
                                                                                    <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                                                                                        <DollarSign size={10} />
                                                                                        {deal.value.toLocaleString('pt-BR', { notation: 'compact' })}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        );
                                                    })}
                                                </AnimatePresence>
                                                {provided.placeholder}

                                                {/* Empty State */}
                                                {columnDeals.length === 0 && !snapshot.isDraggingOver && (
                                                    <div className="flex flex-col items-center justify-center py-8 text-gray-600">
                                                        <Inbox size={24} className="mb-2 opacity-50" />
                                                        <span className="text-xs">Arraste cards aqui</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </DragDropContext>

            <DealDetailModal
                deal={selectedDeal}
                onClose={() => setSelectedDeal(null)}
            />
        </div>
    );
}
