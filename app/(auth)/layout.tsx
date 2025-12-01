import { Activity } from "lucide-react"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="w-full h-screen lg:grid lg:grid-cols-2">
            <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-10 text-white">
                <div className="flex items-center gap-2 font-medium text-lg">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-black">
                        <Activity className="h-4 w-4" />
                    </div>
                    TeamPulse
                </div>
                <div className="space-y-2">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;This library has saved me countless hours of work and helped me deliver stunning designs to my clients faster than ever before.&rdquo;
                        </p>
                        <footer className="text-sm text-zinc-400">Sofia Davis</footer>
                    </blockquote>
                </div>
            </div>
            <div className="flex items-center justify-center py-12">
                {children}
            </div>
        </div>
    )
}
