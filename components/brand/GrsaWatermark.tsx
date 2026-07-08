export function GrsaWatermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden select-none"
    >
      <div
        className="flex flex-col items-center opacity-[0.05]"
        style={{ width: "clamp(220px, 62vw, 620px)" }}
      >
        <svg
          viewBox="0 0 320 150"
          className="w-full text-brand-900"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M18 122 C 95 40, 175 18, 302 30"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <text
            x="160"
            y="112"
            textAnchor="middle"
            fontFamily="var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
            fontWeight="700"
            fontSize="92"
            letterSpacing="2"
            stroke="none"
            fill="currentColor"
          >
            GRSA
          </text>
        </svg>
        <p
          className="mt-1 text-center text-brand-900 uppercase"
          style={{
            fontSize: "clamp(9px, 1.6vw, 15px)",
            letterSpacing: "0.18em",
            lineHeight: 1.6,
            fontWeight: 600,
          }}
        >
          Soluções em Alimentação e
          <br />
          em Serviços de Suporte
        </p>
      </div>
    </div>
  );
}
