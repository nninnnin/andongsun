import clsx from "clsx";

const Section = ({
  className = "",
  children,
}: {
  className: string;
  children: React.ReactNode;
}) => {
  return (
    <section className={clsx("flex-1", className)}>
      {children}
    </section>
  );
};

Section.Header = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <h1 className="text-[1em]">{children}</h1>;
};

export default Section;
