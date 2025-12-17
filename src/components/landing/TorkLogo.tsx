export function TorkLogo() {
    return (
        <div className="flex items-center gap-3">
            {/* SVG Minimalista - Hexágono com Gradiente */}
            <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
            >
                <defs>
                    <linearGradient id="torkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                </defs>

                {/* Hexágono Geométrico */}
                <path
                    d="M18 2L31.5 10V26L18 34L4.5 26V10L18 2Z"
                    fill="url(#torkGradient)"
                    opacity="0.9"
                />

                {/* "T" Estilizado no Centro */}
                <path
                    d="M13 12H23V15H20V24H16V15H13V12Z"
                    fill="white"
                    opacity="0.95"
                />
            </svg>

            {/* Texto "Tork" */}
            <span className="text-lg font-bold tracking-tight text-white">
                Tork
            </span>
        </div>
    );
}
