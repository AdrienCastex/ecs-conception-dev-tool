import { ReactNode, ReactElement, isValidElement, Children, cloneElement } from "react";

const hasChildren = (
    element: ReactNode,
): element is ReactElement<{ children: ReactNode | ReactNode[] }> =>
    isValidElement<{ children?: ReactNode[] }>(element) && Boolean(element.props.children);
const hasComplexChildren = (
    element: ReactNode,
): element is ReactElement<{ children: ReactNode | ReactNode[] }> =>
    isValidElement(element) &&
    hasChildren(element) &&
    Children.toArray(element.props.children).reduce(
        (response: boolean, child: ReactNode): boolean => response || isValidElement(child),
        false,
    );

export enum DeepFilterResult {
    RejectAndStop,
    AcceptAndStop,
    AcceptAndContinue,
}

export const deepFilter = (
    children: ReactNode | ReactNode[],
    deepFilterFn: (child: ReactNode, index?: number, children?: ReactNode[]) => DeepFilterResult,
): ReactNode[] =>
    Children.toArray(children)
        .map((child: ReactNode, i, children) => {
            const result = deepFilterFn(child, i, children);

            if (result === DeepFilterResult.RejectAndStop) {
                return;
            }
            if (result === DeepFilterResult.AcceptAndStop) {
                return child;
            }

            if (isValidElement(child) && hasComplexChildren(child)) {
                // Clone the child that has children and filter them too
                return cloneElement(child, {
                    ...child.props,
                    children: deepFilter(child.props.children, deepFilterFn),
                });
            }
            return child;
        });
