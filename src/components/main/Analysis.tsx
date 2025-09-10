import type React from "react"
import { Briefcase, Clock, BarChart3 } from "lucide-react"
import { NumberTicker } from "../magicui/number-ticker"

type StatisticsProps = {
    activeOpportunities: number
    expiredOpportunities?: number
    totalOpportunities?: number
}

export const Statistics: React.FC<StatisticsProps> = ({
    activeOpportunities,
    expiredOpportunities = 0,
}) => {
    const stats = [
        {
            icon: Briefcase,
            value: activeOpportunities,
            label: "Active Opportunities",
            description: "Currently available positions",
            color: "from-emerald-400 to-cyan-400",
            bgGlow: "group-hover:shadow-emerald-500/25",
            iconBg: "bg-gradient-to-br from-emerald-500 to-cyan-500",
        },
        {
            icon: Clock,
            value: expiredOpportunities,
            label: "Expired Opportunities",
            description: "Past application deadlines",
            color: "from-amber-400 to-orange-400",
            bgGlow: "group-hover:shadow-amber-500/25",
            iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
        },
        {
            icon: BarChart3,
            value: expiredOpportunities + activeOpportunities,
            label: "Total Opportunities",
            description: "All posted positions",
            color: "from-blue-400 to-indigo-400",
            bgGlow: "group-hover:shadow-blue-500/25",
            iconBg: "bg-gradient-to-br from-blue-500 to-indigo-500",
        },
    ]

    return (
        <div className="py-6 px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className={`group relative bg-white rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-2xl ${stat.bgGlow} transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer overflow-hidden`}
                    >
                        {/* Background gradient overlay */}
                        <div
                            className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}
                        ></div>

                        {/* Animated border */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Content */}
                        <div className="relative z-10">
                            {/* Icon container */}
                            <div
                                className={`${stat.iconBg} w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}
                            >
                                <stat.icon className="w-7 h-7 text-white" strokeWidth={2} />
                            </div>

                            {/* Value */}
                            <NumberTicker
                                value={stat.value}
                                className="text-3xl font-extrabold text-blue-900 mb-1"
                                style={{ color:'#1e3c98'}}
                            />

                            {/* Label */}
                            <div className="text-gray-600 font-semibold text-sm mb-1 group-hover:text-gray-700 transition-colors duration-300">
                                {stat.label}
                            </div>

                            {/* Description */}
                            <div className="text-gray-400 text-xs group-hover:text-gray-500 transition-colors duration-300">
                                {stat.description}
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
                        </div>

                        {/* Shine effect */}
                        <div className="absolute inset-0 -top-4 -left-4 w-6 h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:translate-x-full transition-all duration-700 rotate-12 skew-x-12"></div>
                    </div>
                ))}
            </div>
        </div>
    )
}
