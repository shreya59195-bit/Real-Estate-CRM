export default function SectionCard({ title, children, right }) {
  return (
    <div className="crm-card crm-hover rounded-[28px] p-5 border border-white/70 dark:border-slate-800/80 fade-up">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage your CRM data with a polished workflow
          </p>
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}