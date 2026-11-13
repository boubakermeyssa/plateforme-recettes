export function Label({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <span id={id} className="text-[13px] font-bold uppercase tracking-wider text-texte-2">
      {children}
    </span>
  );
}
