
import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function Loader() {
    return (
        <div className=" loader-container w-full absolute justify-center top-0 left-0 card flex justify-content-center">
            <ProgressSpinner />
        </div>
    );
}
        