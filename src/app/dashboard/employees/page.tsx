"use client";

import * as React from "react";
import type { Metadata } from "next";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";

import { config } from "@/config";
import { CustomersFilters } from "@/components/dashboard/customer/empolyee-filters";
import { CustomersTable } from "@/components/dashboard/customer/empolyee-table";

// export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

export const EmployeeList = [
	{
		createdDate: "2025-06-20",
		name: "Amit Kumar",
		email: "amit.kumar@example.com",
		role: "Admin",
		status: "Active",
	},
	{
		createdDate: "2025-06-19",
		name: "Neha Joshi",
		email: "neha.joshi@example.com",
		role: "HR",
		status: "Deactivated",
	},
	{
		createdDate: "2025-06-18",
		name: "Rahul Sharma",
		email: "rahul.sharma@example.com",
		role: "Developer",
		status: "Active",
	},
	{
		createdDate: "2025-06-17",
		name: "Priya Singh",
		email: "priya.singh@example.com",
		role: "Manager",
		status: "Active",
	},
	{
		createdDate: "2025-06-16",
		name: "Siddharth Mehta",
		email: "siddharth.mehta@example.com",
		role: "Intern",
		status: "Deactivated",
	},
	{
		createdDate: "2025-06-15",
		name: "Kavita Patel",
		email: "kavita.patel@example.com",
		role: "Support",
		status: "Active",
	},
	{
		createdDate: "2025-06-14",
		name: "Vikram Desai",
		email: "vikram.desai@example.com",
		role: "QA Engineer",
		status: "Active",
	},
	{
		createdDate: "2025-06-13",
		name: "Anita Roy",
		email: "anita.roy@example.com",
		role: "HR",
		status: "Deactivated",
	},
	{
		createdDate: "2025-06-12",
		name: "Manish Gupta",
		email: "manish.gupta@example.com",
		role: "Developer",
		status: "Active",
	},
	{
		createdDate: "2025-06-11",
		name: "Rekha Sharma",
		email: "rekha.sharma@example.com",
		role: "Admin",
		status: "Active",
	},
	{
		createdDate: "2025-06-10",
		name: "Sunil Kumar",
		email: "sunil.kumar@example.com",
		role: "Support",
		status: "Deactivated",
	},
	{
		createdDate: "2025-06-09",
		name: "Pooja Singh",
		email: "pooja.singh@example.com",
		role: "Manager",
		status: "Active",
	},
];

export default function EmpolyeesListPage(): React.JSX.Element {
	const [searchInput, SetSearchInput] = React.useState("");

	return (
		<Stack spacing={3}>
			<Stack direction="row" spacing={3}>
				<Stack spacing={1} sx={{ flex: "1 1 auto" }}>
					<Typography variant="h4">Employee List Page</Typography>
				</Stack>
				<div>
					<Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
						Add
					</Button>
				</div>
			</Stack>
			<CustomersFilters />
			<CustomersTable list={EmployeeList} />
		</Stack>
	);
}
