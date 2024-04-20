// components/ConstructorProfile.tsx
import React from 'react';
import Image from 'next/image';

const ConstructorProfile: React.FC<{ data: any }> = ({ data }) => {
    return (
        <div>
            <h1>{data?.name}</h1>
            <Image 
                src={`/logos/${data?.constructorId}.png`} 
                alt={data?.name} 
                width={50} 
                height={50} />

            <Image 
                src={`/cars/${data?.constructorId}.png`} 
                alt={data?.name} 
                width={500}
                height={200} />
        </div>
    );
};

export default ConstructorProfile;
