import type { ReactNode } from "react";
import BaseLayoutBottom from "./BaseLayoutBottom";
import BaseLayoutContent from "./BaseLayoutContent";
import BaseLayoutTop from "./BaseLayoutTop";

interface Props { children : ReactNode; }

const BaseLayout = ({children} : Props) => {
    return (
        <>
            <BaseLayoutTop />
            <BaseLayoutContent>{children}</BaseLayoutContent>
            <BaseLayoutBottom />
        </>
    );
}

export default BaseLayout;