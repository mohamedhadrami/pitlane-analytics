// @/components/table/SekeltonRow.tsx

import { Skeleton } from "@nextui-org/react";

const SkeletonRow: React.FC = () => {
    return (
        <Skeleton className="w-3/5 rounded-lg">
            <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
        </Skeleton>
    )
}

export default SkeletonRow;