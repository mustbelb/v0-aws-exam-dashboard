"use client"
import { useState } from "react"
import Link from "next/link"
import { allExplainers } from "@/components/explainers"
import { Header } from "@/components/header"
export function LessonsPreview() {
 const [topic, setTopic] = useState('sns-topics')
 const Lesson = allExplainers[topic]
 return <><Header preview/><main className="workspace"><Link href="/design-preview" className="text-primary text-sm">← Design preview</Link><h1 className="editorial-title text-4xl mt-6 mb-4">Lesson playback review</h1><p className="text-muted-foreground mb-6">Preview all lessons without connecting to your question bank.</p><label htmlFor="lesson" className="block text-sm font-medium mb-2">Choose a lesson</label><select id="lesson" value={topic} onChange={e=>setTopic(e.target.value)} className="border rounded-lg bg-card p-3 mb-6 w-full max-w-lg">{Object.keys(allExplainers).sort().map(id=><option key={id} value={id}>{id.replaceAll('-',' ')}</option>)}</select><div className="explainer-stage dark" data-playing-review><Lesson key={topic}/></div></main></>
}
