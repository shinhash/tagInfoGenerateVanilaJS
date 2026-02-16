import type { ReactNode } from "react";

interface Props { children : ReactNode; }

const BaseLayoutContent = ({children} : Props) => {
    return(
        <>
            {children}
        </>
    );
}

export default BaseLayoutContent;