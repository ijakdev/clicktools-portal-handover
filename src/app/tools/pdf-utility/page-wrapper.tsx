'use client'

import PdfHub from "@/components/tools/PdfHub";
import React from "react";
import {useSearchParams} from "next/navigation";
import {ToolId} from "@/types/pdf-tools";

export function PageWrapper(){
    const searchParams = useSearchParams();
    const toolId = searchParams.get("toolId")?.toString() as ToolId;
    return <PdfHub toolId={toolId}/>
}