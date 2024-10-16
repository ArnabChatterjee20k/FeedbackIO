import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import FeedbackForm from '../../../../../components/feedback-form'
import LandingPage from '../../../../../components/landing-page'
import ThankYouPage from '../../../../../components/thankyou-page'

interface Props {
    mode: "edit" | "new",
    data?: Record<string, string>
}

type TabName = "LandingPage" | "Feedback" | "ThankYou" | "Settings" | "Notifications"

export default function Space({ mode, data }: Props) {
    const [activeTab, setActiveTab] = useState<TabName>("LandingPage")

    const tabContent: Record<TabName, React.ReactNode> = {
        LandingPage: <LandingPage />,
        Feedback: <FeedbackForm />,
        ThankYou: <ThankYouPage />,
        Settings: <FeedbackForm/>,
        Notifications: <FeedbackForm/>
    }

    return (
        <div className="flex flex-col md:flex-row gap-8 p-5 justify-between">
            <div className="w-full md:w-1/3">
                <div className="p-4 shadow-sm aspect-[9/16] overflow-hidden">
                    {tabContent[activeTab]}
                </div>
            </div>
            <div className="w-full">
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabName)} className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                        {(Object.keys(tabContent) as TabName[]).map((tab) => (
                            <TabsTrigger key={tab} value={tab}>
                                {tab}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <div className="mt-4">
                        {(Object.entries(tabContent) as [TabName, React.ReactNode][]).map(([tab, content]) => (
                            <TabsContent key={tab} value={tab}>
                                <Card className="p-4">
                                    <h2 className="text-lg font-semibold mb-2">{tab} Settings</h2>
                                    {/* Add form controls or settings for each tab here */}
                                    <p>Configure your {tab} settings here.</p>
                                </Card>
                            </TabsContent>
                        ))}
                    </div>
                </Tabs>
            </div>
        </div>
    )
}