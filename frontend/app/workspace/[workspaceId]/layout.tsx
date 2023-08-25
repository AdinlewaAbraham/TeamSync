import React, { ReactElement, ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <section>
      <nav>this is your navbar</nav> <main>{children}</main>
    </section>
  );
};

export default layout;
