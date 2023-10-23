import React, { useState, ReactElement } from "react";
import { Form } from "react-bootstrap";
import "./DropDownSearchView";
import { deepFilter, DeepFilterResult } from "../deepFilter";

export const DropDownSearch = React.forwardRef<HTMLDivElement, { children: any, style?: React.CSSProperties, className?: string, 'aria-labelledby'?: string }>(({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value, setValue] = useState('');

    return (
        <div
            ref={ref}
            style={style}
            className={className}
            aria-labelledby={labeledBy}
        >
            <Form.Control
                autoFocus
                className="search-input"
                placeholder="Type to filter..."
                onChange={(e) => {
                    setValue(e.target.value.replace(/\s/img, '').toLowerCase());
                }}
                value={value}
            />
            {deepFilter(children, (child: ReactElement) => {
                return child?.props && child.props['data-filter'] ? (child.props['data-filter'].toString().toLowerCase().replace(/\s/img, '').includes(value) ? DeepFilterResult.AcceptAndStop : DeepFilterResult.RejectAndStop) : DeepFilterResult.AcceptAndContinue;
            })}
        </div>
    );
});
