import React, { FC } from 'react';

const Button: FC<{label:string}> = ({label}) => {
    return (
        <button className='font-russoOne hover:bg-purple-300 ease-in transition-all text-sm rounded-3xl w-24 py-3 text-dark-100 bg-primary-200 align-middle duration-300'>{label}</button>    
    )
}

export default Button;