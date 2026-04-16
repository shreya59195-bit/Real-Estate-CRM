export default function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-6 pt-2 fade-up">
      <div className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 px-4 py-1 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
        CRM Dashboard
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
        {title}
      </h1>
      {subtitle ? (
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-base sm:text-lg max-w-3xl">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}