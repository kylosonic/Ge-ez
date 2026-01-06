
export const ProductSkeleton = () => {
    return (
        <div className="animate-pulse flex flex-col gap-4">
            <div className="bg-stone-200 aspect-[4/5] w-full rounded-sm" />
            <div className="space-y-2">
                <div className="h-4 bg-stone-200 w-3/4 rounded" />
                <div className="h-4 bg-stone-200 w-1/4 rounded" />
            </div>
        </div>
    );
};
