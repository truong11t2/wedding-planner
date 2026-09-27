'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import type { Bank } from '@/api/bank';

interface BankSelectProps {
	/** Current bank value stored in the config (matches `shortName`, `code` or `name`). */
	value?: string;
	/** Banks usable with VietQR. */
	banks: Bank[];
	/** True while the bank list is still loading. */
	loading?: boolean;
	disabled?: boolean;
	placeholder?: string;
	/** Called with the full bank (so the caller can persist both name and BIN). */
	onSelect: (bank: Bank) => void;
}

/** Resolves a stored bank value (short name, code or full name) to a bank entry. */
function findBank(banks: Bank[], value?: string): Bank | undefined {
	if (!value) return undefined;

	const needle = value.trim().toLowerCase();
	return banks.find((bank) =>
		[bank.shortName, bank.code, bank.name].some((field) => field.trim().toLowerCase() === needle)
	);
}

/**
 * Searchable bank picker backed by the VietQR bank list.
 *
 * Only banks with a BIN can produce a VietQR image, so a free-text bank name
 * alone is not enough — this lets the user pick one that can.
 */
export default function BankSelect({
	value,
	banks,
	loading = false,
	disabled = false,
	placeholder = 'Chọn ngân hàng',
	onSelect
}: BankSelectProps) {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState('');
	const containerRef = useRef<HTMLDivElement>(null);

	const selected = useMemo(() => findBank(banks, value), [banks, value]);

	// Close when the user clicks/taps outside or presses Escape.
	useEffect(() => {
		if (!open) return;

		const handlePointerDown = (event: MouseEvent | TouchEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setOpen(false);
			}
		};
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setOpen(false);
		};

		document.addEventListener('mousedown', handlePointerDown);
		document.addEventListener('touchstart', handlePointerDown);
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('mousedown', handlePointerDown);
			document.removeEventListener('touchstart', handlePointerDown);
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [open]);

	const results = useMemo(() => {
		const needle = query.trim().toLowerCase();
		if (!needle) return banks;

		return banks.filter((bank) =>
			[bank.shortName, bank.code, bank.name, bank.bin].some((field) =>
				field.toLowerCase().includes(needle)
			)
		);
	}, [banks, query]);

	const toggle = () => {
		if (disabled) return;
		setQuery('');
		setOpen((prev) => !prev);
	};

	const pick = (bank: Bank) => {
		onSelect(bank);
		setOpen(false);
		setQuery('');
	};

	return (
		<div ref={containerRef} className="relative">
			<button
				type="button"
				onClick={toggle}
				disabled={disabled}
				aria-haspopup="listbox"
				aria-expanded={open}
				className="input flex items-center justify-between gap-2 text-left disabled:cursor-not-allowed disabled:opacity-60"
			>
				<span className={`truncate ${selected || value ? 'text-slate-900' : 'text-slate-400'}`}>
					{selected?.shortName || value || placeholder}
				</span>
				<ChevronDown
					className={`h-4 w-4 shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`}
				/>
			</button>

			{open ? (
				<div className="absolute z-30 mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
					<input
						autoFocus
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Tìm ngân hàng..."
						className="input"
					/>

					<div className="mt-2 max-h-56 overflow-y-auto" role="listbox">
						{loading ? (
							<div className="flex items-center gap-2 px-2 py-3 text-sm text-slate-500">
								<Loader2 className="h-4 w-4 animate-spin" />
								Đang tải danh sách ngân hàng...
							</div>
						) : results.length === 0 ? (
							<p className="px-2 py-3 text-sm text-slate-500">Không tìm thấy ngân hàng.</p>
						) : (
							results.map((bank) => (
								<button
									key={bank.bin}
									type="button"
									role="option"
									aria-selected={selected?.bin === bank.bin}
									onClick={() => pick(bank)}
								className={`flex w-full flex-col rounded-lg px-2 py-2 text-left text-sm transition hover:bg-pink-50 ${
									selected?.bin === bank.bin ? 'bg-pink-50 text-pink-700' : 'text-slate-700'
								}`}
							>
								<span className="truncate font-medium">{bank.shortName}</span>
								<span className="truncate text-xs text-slate-500">{bank.name}</span>
								</button>
							))
						)}
					</div>
				</div>
			) : null}
		</div>
	);
}
