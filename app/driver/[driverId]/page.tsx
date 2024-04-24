"use client"

import { useState, useEffect } from "react"

interface props {
    params: {
        driverId: string
    }
}

const Page: React.FC<props> = ({params}) => {
    return (
        <div>{params.driverId}</div>
    )
}

export default Page;