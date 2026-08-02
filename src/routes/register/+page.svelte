<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let { data, form } = $props();

	let isLoading = $state(false);
	let showPassword = $state(false);
	let regError = $state<string | null>(null);
	let confirmSent = $state(false);

	let nameValue = $state('');
	let emailValue = $state('');
	let passwordValue = $state('');
	let passwordConfirmValue = $state('');

	// אזהרה מיידית על סיסמאות שאינן תואמות - בלי לחכות לשליחה
	const mismatch = $derived(
		passwordConfirmValue.length > 0 && passwordValue !== passwordConfirmValue
	);

	// מוסיף welcome=new ליעד — מפעיל את מסך "ברוכים המצטרפים" אחרי ההרשמה
	function withWelcome(dest: string): string {
		try {
			const u = new URL(dest, window.location.origin);
			u.searchParams.set('welcome', 'new');
			return `${u.pathname}${u.search}${u.hash}`;
		} catch {
			return '/?welcome=new';
		}
	}
</script>

<svelte:head>
	<title>הרשמה - ועדי שכונות ארצי</title>
</svelte:head>

<div
	class="min-h-[80vh] flex items-center justify-center px-4 py-12"
	dir="rtl"
	role="button"
	tabindex="0"
	onclick={() => goto('/')}
	onkeydown={(e) => e.key === 'Escape' && goto('/')}
>
	<div class="w-full max-w-md" onclick={(e) => e.stopPropagation()}>

		<div class="bg-[#0f172a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">

			<div class="h-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>

			<div class="p-8 md:p-10">

				{#if confirmSent}
					<!-- אישור אימייל מופעל ב-Strapi: החשבון נוצר אך ממתין לאישור -->
					<div class="text-center">
						<div class="flex justify-center mb-4">
							<div class="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-xl">
								<span class="text-3xl">📬</span>
							</div>
						</div>
						<h1 class="text-2xl font-black text-white mb-2">כמעט סיימנו</h1>
						<p class="text-gray-400 text-sm mb-6 leading-relaxed">
							שלחנו מייל אישור אל <span class="text-white font-bold" dir="ltr">{emailValue}</span>.
							צריך רק ללחוץ על הקישור שבמייל, ואז אפשר להתחבר.
						</p>
						<a
							href="/login"
							class="block w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black hover:opacity-90 transition-opacity"
						>
							למסך ההתחברות
						</a>
					</div>
				{:else}
					<div class="text-center mb-8">
						<div class="flex justify-center mb-4">
							<div class="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center shadow-xl">
								<span class="text-3xl">🏘️</span>
							</div>
						</div>
						<h1 class="text-2xl font-black text-white mb-2">ברוכים המצטרפים</h1>
						<p class="text-gray-400 text-sm">פותחים חשבון - וזה תקף בכל אתרי הרשת</p>
					</div>

					{#if form?.error || regError}
						<div id="register-error" role="alert" class="mb-6 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-center">
							<p class="text-red-400 text-sm font-medium">{regError ?? form?.error}</p>
						</div>
					{/if}

					<form method="POST" action="?/register" use:enhance={() => {
						isLoading = true;
						regError = null;
						return async ({ result }) => {
							if (result.type === 'success') {
								if ((result.data as { needsConfirmation?: boolean })?.needsConfirmation) {
									confirmSent = true;
									isLoading = false;
									return;
								}
								await signIn('credentials', {
									email: emailValue,
									password: passwordValue,
									callbackUrl: withWelcome(data.redirectTo || '/')
								});
							} else if (result.type === 'failure') {
								regError = (result.data as { error?: string })?.error ?? 'שגיאה לא ידועה';
								isLoading = false;
							} else {
								isLoading = false;
							}
						};
					}}>
						<div class="mb-4">
							<label for="name" class="block text-sm font-medium text-gray-400 mb-2">שם מלא</label>
							<input
								id="name"
								name="name"
								type="text"
								required
								autocomplete="name"
								bind:value={nameValue}
								aria-describedby={form?.error || regError ? 'register-error' : undefined}
								class="w-full bg-[#1e293b] border border-white/10 rounded-xl px-4 py-3
								       text-white placeholder-gray-500 focus:outline-none focus:border-purple-500
								       focus:ring-1 focus:ring-purple-500 transition-colors"
								placeholder="ישראל ישראלי"
							/>
						</div>

						<div class="mb-4">
							<label for="email" class="block text-sm font-medium text-gray-400 mb-2">אימייל</label>
							<input
								id="email"
								name="email"
								type="email"
								required
								autocomplete="email"
								bind:value={emailValue}
								class="w-full bg-[#1e293b] border border-white/10 rounded-xl px-4 py-3
								       text-white placeholder-gray-500 focus:outline-none focus:border-purple-500
								       focus:ring-1 focus:ring-purple-500 transition-colors"
								placeholder="your@email.com"
							/>
						</div>

						<div class="mb-4">
							<label for="password" class="block text-sm font-medium text-gray-400 mb-2">סיסמה</label>
							<div class="relative">
								<input
									id="password"
									name="password"
									type={showPassword ? 'text' : 'password'}
									required
									minlength="6"
									autocomplete="new-password"
									bind:value={passwordValue}
									class="w-full bg-[#1e293b] border border-white/10 rounded-xl px-4 py-3 pl-11
									       text-white placeholder-gray-500 focus:outline-none focus:border-purple-500
									       focus:ring-1 focus:ring-purple-500 transition-colors"
									placeholder="לפחות 6 תווים"
								/>
								<button
									type="button"
									onclick={() => (showPassword = !showPassword)}
									class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
									aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
								>
									{#if showPassword}
										<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" focusable="false">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
										</svg>
									{:else}
										<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" focusable="false">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
										</svg>
									{/if}
								</button>
							</div>
						</div>

						<div class="mb-6">
							<label for="passwordConfirm" class="block text-sm font-medium text-gray-400 mb-2">אימות סיסמה</label>
							<input
								id="passwordConfirm"
								name="passwordConfirm"
								type={showPassword ? 'text' : 'password'}
								required
								autocomplete="new-password"
								bind:value={passwordConfirmValue}
								aria-invalid={mismatch}
								class="w-full bg-[#1e293b] border rounded-xl px-4 py-3
								       text-white placeholder-gray-500 focus:outline-none focus:ring-1
								       transition-colors {mismatch
									? 'border-red-500/60 focus:border-red-500 focus:ring-red-500'
									: 'border-white/10 focus:border-purple-500 focus:ring-purple-500'}"
								placeholder="שוב, אותה סיסמה"
							/>
							{#if mismatch}
								<p class="mt-2 text-xs text-red-400">הסיסמאות אינן תואמות</p>
							{/if}
						</div>

						<button
							type="submit"
							disabled={isLoading || mismatch}
							class="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600
							       hover:from-blue-500 hover:to-purple-500 text-white font-bold shadow-lg
							       transition-all duration-200 hover:-translate-y-0.5 cursor-pointer mb-6
							       disabled:opacity-60 disabled:cursor-not-allowed"
						>
							{#if isLoading}
								<span class="inline-flex items-center gap-2 justify-center">
									<span class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
									נרשם...
								</span>
							{:else}
								✨ פתיחת חשבון
							{/if}
						</button>
					</form>

					<p class="text-center text-sm text-gray-500 mb-4">
						כבר יש לך חשבון?
						<a href="/login" class="text-purple-400 hover:text-purple-300 font-medium transition-colors">
							התחבר כאן
						</a>
					</p>

					<div class="text-center">
						<p class="text-xs text-gray-500 leading-relaxed">
							ההרשמה תקפה בכל אתרי הרשת של "יוצאים לחירות" - לא צריך להירשם שוב באתר אחר.
						</p>
					</div>
				{/if}

			</div>
		</div>

		<div class="text-center mt-6">
			<a href="/" class="text-gray-500 hover:text-gray-400 text-sm transition-colors">
				← חזרה לדף הבית
			</a>
		</div>

	</div>
</div>
