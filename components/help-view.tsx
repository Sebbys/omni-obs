"use client"

import { useState } from "react"
import {
    Search,
    Book,
    MessageCircle,
    Mail,
    ExternalLink,
    ChevronRight,
    HelpCircle,
    FileText,
    Video,
    Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const quickLinks = [
    {
        icon: Book,
        title: "Documentation",
        description: "Comprehensive guides and tutorials",
        href: "#",
    },
    {
        icon: Video,
        title: "Video Tutorials",
        description: "Step-by-step video walkthroughs",
        href: "#",
    },
    {
        icon: MessageCircle,
        title: "Community Forum",
        description: "Connect with other users",
        href: "#",
    },
    {
        icon: Mail,
        title: "Contact Support",
        description: "Get help from our team",
        href: "#",
    },
]

const faqs = [
    {
        question: "How do I create a new project?",
        answer:
            "Navigate to the Projects page and click the 'New Project' button. Fill in the project details including name, description, and color. You can then add team members and start creating tasks.",
    },
    {
        question: "How do I assign tasks to team members?",
        answer:
            "When creating or editing a task, you can select team members from the 'Assignees' dropdown. Multiple team members can be assigned to a single task for collaborative work.",
    },
    {
        question: "Can I export reports?",
        answer:
            "Yes! Go to the Reports page and use the export button to download your team's performance data in CSV or PDF format. You can customize the date range and metrics included.",
    },
    {
        question: "How do notifications work?",
        answer:
            "Notifications keep you informed about task updates, comments, and team changes. You can customize your notification preferences in Settings > Notifications.",
    },
    {
        question: "How do I invite team members?",
        answer:
            "Go to Team > Add Member and enter their email address. They'll receive an invitation to join your workspace. You can also set their role and permissions.",
    },
    {
        question: "What are the different task priorities?",
        answer:
            "Tasks can be set to High, Medium, or Low priority. High priority tasks are highlighted in red, Medium in yellow, and Low in green to help you focus on what matters most.",
    },
]

const categories = [
    { icon: FileText, label: "Getting Started", count: 12 },
    { icon: Users, label: "Team Management", count: 8 },
    { icon: HelpCircle, label: "Tasks & Projects", count: 15 },
    { icon: Video, label: "Reports & Analytics", count: 6 },
]

export function HelpView() {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredFaqs = searchQuery
        ? faqs.filter(
            (faq) =>
                faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        : faqs

    return (
        <div className="p-4 md:p-6 space-y-6 max-w-4xl">
            {/* Header */}
            <div>
                <h1 className="text-xl md:text-2xl font-semibold text-foreground">Help & Support</h1>
                <p className="text-sm text-muted-foreground">Find answers and get assistance</p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search for help..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                />
            </div>

            {/* Quick Links */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickLinks.map((link) => (
                    <Card key={link.title} className="cursor-pointer hover:border-muted-foreground/30 transition-colors">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                                    <link.icon className="w-5 h-5 text-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-medium text-foreground">{link.title}</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">{link.description}</p>
                                </div>
                                <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* FAQs */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Frequently Asked Questions</CardTitle>
                            <CardDescription>Quick answers to common questions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {filteredFaqs.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    No results found for &quot;{searchQuery}&quot;
                                </p>
                            ) : (
                                <Accordion type="single" collapsible className="w-full">
                                    {filteredFaqs.map((faq, index) => (
                                        <AccordionItem key={index} value={`item-${index}`}>
                                            <AccordionTrigger className="text-sm text-left">{faq.question}</AccordionTrigger>
                                            <AccordionContent className="text-sm text-muted-foreground">{faq.answer}</AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Categories */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Browse by Category</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            {categories.map((category) => (
                                <Button key={category.label} variant="ghost" className="w-full justify-between h-auto py-2">
                                    <div className="flex items-center gap-2">
                                        <category.icon className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">{category.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">{category.count}</span>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                </Button>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Contact Support */}
                    <Card className="bg-accent/50">
                        <CardContent className="p-4">
                            <h3 className="font-medium text-foreground mb-2">Still need help?</h3>
                            <p className="text-sm text-muted-foreground mb-4">Our support team is available 24/7 to assist you.</p>
                            <Button className="w-full">
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Contact Support
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
