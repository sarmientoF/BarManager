import {
	AcademicCapIcon,
	BadgeCheckIcon,
	CashIcon,
	ClockIcon,
	ReceiptRefundIcon,
	UsersIcon,
} from "@heroicons/react/outline";
import React from "react";

const actions = [
	{
		title: "Request time off",
		href: "#",
		icon: ClockIcon,
		iconForeground: "text-teal-700",
		iconBackground: "bg-teal-50",
	},
	{
		title: "Benefits",
		href: "#",
		icon: BadgeCheckIcon,
		iconForeground: "text-purple-700",
		iconBackground: "bg-purple-50",
	},
	{
		title: "Schedule a one-on-one",
		href: "#",
		icon: UsersIcon,
		iconForeground: "text-sky-700",
		iconBackground: "bg-sky-50",
	},
	{
		title: "Payroll",
		href: "#",
		icon: CashIcon,
		iconForeground: "text-yellow-700",
		iconBackground: "bg-yellow-50",
	},
	{
		title: "Submit an expense",
		href: "#",
		icon: ReceiptRefundIcon,
		iconForeground: "text-rose-700",
		iconBackground: "bg-rose-50",
	},
];

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

export default function GuideItems() {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
			{actions.map((person) => (
				<div
					key={person.title}
					className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
				>
					<div className="flex-shrink-0">
						
					</div>
					<div className="flex-1 min-w-0">
						<a href="#" className="focus:outline-none">
							<span className="absolute inset-0" aria-hidden="true" />
							<p className="text-sm font-medium text-gray-900">
								{person.title}
							</p>
							<p className="text-sm text-gray-500 truncate">{person.title}</p>
						</a>
					</div>
				</div>
			))}
		</div>
	);
}
