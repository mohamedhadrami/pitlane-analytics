"use client"

import { useState, useEffect } from "react"

interface props {
    params: {
        constructorId: string
    }
}

const Page: React.FC<props> = ({params}) => {
    return (
        <div>{params.constructorId}</div>
    )
}

export default Page;