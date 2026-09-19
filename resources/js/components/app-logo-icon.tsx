import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 256 256"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M62 205V48"
                stroke="currentColor"
                strokeWidth="15"
                strokeLinecap="square"
            />
            <circle
                cx="122"
                cy="103"
                r="67"
                stroke="currentColor"
                strokeWidth="15"
            />
            <path
                d="M154 205v-53c0-29 21-51 47-51s47 22 47 51v53"
                stroke="currentColor"
                strokeWidth="15"
                strokeLinecap="square"
            />
        </svg>
    );
}
