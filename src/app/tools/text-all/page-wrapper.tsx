'use client'

import React from "react";
import {useSearchParams} from "next/navigation";
import {ToolId} from "@/types/pdf-tools";
import TextToolbox from "@/components/tools/TextToolbox";

export function PageWrapper(){
    const searchParams = useSearchParams();
    const toolId = searchParams.get("tool")?.toString() as ToolId;
    return <TextToolbox toolId={toolId}/>
}