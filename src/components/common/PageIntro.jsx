function PageIntro({ kicker, title, description, align = "left" }) {
  const headingClassName = align === "left" ? "section-heading section-heading-left" : "section-heading";

  return (
    <div className={headingClassName}>
      <p className="section-kicker">{kicker}</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}

export default PageIntro;
