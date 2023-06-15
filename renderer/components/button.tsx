import React, { FC } from 'react';

const Button: FC<{label:string}> = ({label}) => {
    return (
        <button className='hover:bg-purple-300 ease-in transition-all text-base font-bold rounded-3xl px-4 py-2 text-dark-100 bg-primary-200 align-middle duration-300'>{label}</button>    
    )
}

export default Button;