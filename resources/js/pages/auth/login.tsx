import { Form, Head, usePage } from '@inertiajs/react';
import { CircleHelp, Lock, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';

// Zod schemas for client-side continuous validation (username & password)
const usernameSchema = z
    .string()
    .trim()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters');

const passwordSchema = z
    .string()
    .min(1, 'Password is required');

const loginSchema = z.object({
    username: usernameSchema,
    password: passwordSchema,
});

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status }: Props) {
    const page = usePage();
    const serverErrors = page.props.errors || {};
    const hasServerErrors = Object.keys(serverErrors).length > 0;

    // 'sso' represents the initial SSO landing screen (Image 1)
    // 'form' represents the username/password login screen (Image 2)
    const [step, setStep] = useState<'sso' | 'form'>(hasServerErrors ? 'form' : 'sso');

    // Controlled inputs for real-time validation
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Zod real-time validation errors
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    // Track user interaction
    const [isUsernameTouched, setIsUsernameTouched] = useState(false);
    const [isPasswordTouched, setIsPasswordTouched] = useState(false);

    // Dismiss server errors when the user starts typing to correct input
    const [dismissServerError, setDismissServerError] = useState(false);

    useEffect(() => {
        if (hasServerErrors) {
            setStep('form');
            setDismissServerError(false);
        }
    }, [hasServerErrors, serverErrors]);

    // Real-time continuous validation on username change
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setUsername(val);
        setIsUsernameTouched(true);
        setDismissServerError(true);

        if (val.trim() === '') {
            setUsernameError('Username is required');
            return;
        }

        const result = usernameSchema.safeParse(val.trim());
        if (!result.success) {
            setUsernameError(result.error.issues[0]?.message ?? 'Username must be at least 3 characters');
        } else {
            setUsernameError(null);
        }
    };

    // Real-time validation on password change
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setPassword(val);
        setIsPasswordTouched(true);
        setDismissServerError(true);

        if (val === '') {
            setPasswordError('Password is required');
            return;
        }

        const result = passwordSchema.safeParse(val);
        if (!result.success) {
            setPasswordError(result.error.issues[0]?.message ?? 'Password is required');
        } else {
            setPasswordError(null);
        }
    };

    // Full validation before submission
    const validate = (): boolean => {
        setIsUsernameTouched(true);
        setIsPasswordTouched(true);
        setDismissServerError(true);

        const result = loginSchema.safeParse({
            username: username.trim(),
            password,
        });

        if (!result.success) {
            const issues = result.error.issues;
            const uIssue = issues.find((i) => i.path[0] === 'username');
            const pIssue = issues.find((i) => i.path[0] === 'password');

            setUsernameError(uIssue ? uIssue.message : null);
            setPasswordError(pIssue ? pIssue.message : null);
            return false;
        }

        setUsernameError(null);
        setPasswordError(null);
        return true;
    };

    // Display client Zod error if touched, otherwise fallback to server error (username / legacy email)
    const activeUsernameError =
        (isUsernameTouched && usernameError) ||
        (!dismissServerError ? (serverErrors.username || serverErrors.email) : null);
    const activePasswordError =
        (isPasswordTouched && passwordError) || (!dismissServerError ? serverErrors.password : null);

    return (
        <>
            <Head title="Sign in" />

            {/* Header with shield icon and title */}
            <div className="mb-8 flex items-center gap-3">
                <Shield className="size-6 shrink-0 text-primary dark:text-rose-400" strokeWidth={1.5} />
                <h1 className="text-2xl font-medium tracking-tight text-primary dark:text-rose-300">
                    Sign in to continue
                </h1>
            </div>

            {status && (
                <div className="mb-5 rounded-lg bg-green-50 p-3 text-center text-sm font-medium text-green-700 dark:bg-green-950/40 dark:text-green-300 dark:border dark:border-green-900/40">
                    {status}
                </div>
            )}

            {step === 'sso' ? (
                /* Step 1: Initial Screen with SSO Continue Button and Account Info */
                <div className="flex flex-col">
                    <Button
                        type="button"
                        onClick={() => setStep('form')}
                        className="h-11 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground shadow-none hover:bg-primary/90 flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                        <Lock className="size-4" />
                        <span>Continue with University SSO</span>
                    </Button>

                    <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-[#FDF0ED] px-4 py-3 text-xs font-medium text-primary dark:bg-rose-950/40 dark:text-rose-200 dark:border dark:border-rose-900/40">
                        <CircleHelp className="size-4 shrink-0 text-primary dark:text-rose-300" />
                        <span>Use your SSO (Microsoft) Account</span>
                    </div>

                    <p className="mt-8 text-center text-xs text-muted-foreground/80 dark:text-zinc-400">
                        Don't have an account yet? Contact your institution administrator!
                    </p>
                </div>
            ) : (
                /* Step 2: Username & Password Login Form */
                <div className="flex flex-col">
                    <Form
                        {...store.form()}
                        onSubmitCapture={(e) => {
                            if (!validate()) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                        }}
                        resetOnSuccess={['password']}
                        className="flex flex-col gap-5"
                    >
                        {({ processing }) => (
                            <>
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="username"
                                        className="text-base font-bold text-primary dark:text-rose-300 tracking-tight"
                                    >
                                        Username
                                    </Label>
                                    <Input
                                        id="username"
                                        type="text"
                                        name="username"
                                        value={username}
                                        onChange={handleUsernameChange}
                                        onBlur={() => {
                                            setIsUsernameTouched(true);
                                            if (username.trim() === '') {
                                                setUsernameError('Username is required');
                                            } else {
                                                const res = usernameSchema.safeParse(username.trim());
                                                setUsernameError(
                                                    res.success
                                                        ? null
                                                        : (res.error.issues[0]?.message ?? 'Username must be at least 3 characters')
                                                );
                                            }
                                        }}
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="username"
                                        placeholder="Enter your username"
                                        className={`h-11 rounded-lg border-0 bg-[#F6F7F9] px-3.5 text-sm text-foreground shadow-none placeholder:text-muted-foreground/50 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-primary dark:bg-[#18191e] dark:border dark:border-white/10 dark:text-white dark:placeholder:text-zinc-500 dark:focus-visible:ring-rose-500/60 ${
                                            activeUsernameError ? 'ring-1 ring-red-500/80 border-red-500/80' : ''
                                        }`}
                                    />
                                    <InputError message={activeUsernameError ?? undefined} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="password"
                                        className="text-base font-bold text-primary dark:text-rose-300 tracking-tight"
                                    >
                                        Password
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        onBlur={() => {
                                            setIsPasswordTouched(true);
                                            if (password === '') {
                                                setPasswordError('Password is required');
                                            } else {
                                                const res = passwordSchema.safeParse(password);
                                                setPasswordError(
                                                    res.success ? null : (res.error.issues[0]?.message ?? 'Password is required')
                                                );
                                            }
                                        }}
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        className={`h-11 rounded-lg border-0 bg-[#F6F7F9] px-3.5 text-sm text-foreground shadow-none placeholder:text-muted-foreground/50 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-primary dark:bg-[#18191e] dark:border dark:border-white/10 dark:text-white dark:placeholder:text-zinc-500 dark:focus-visible:ring-rose-500/60 ${
                                            activePasswordError ? 'ring-1 ring-red-500/80 border-red-500/80' : ''
                                        }`}
                                    />
                                    <InputError message={activePasswordError ?? undefined} />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing || (isUsernameTouched && Boolean(usernameError))}
                                    onClick={(e) => {
                                        if (!validate()) {
                                            e.preventDefault();
                                        }
                                    }}
                                    tabIndex={3}
                                    className="mt-2 h-11 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground shadow-none hover:bg-primary/90 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <Spinner />
                                    ) : (
                                        <Lock className="size-4" />
                                    )}
                                    <span>Continue with University SSO</span>
                                </Button>
                            </>
                        )}
                    </Form>

                    <button
                        type="button"
                        onClick={() => setStep('sso')}
                        className="mt-4 text-center text-xs text-muted-foreground transition-colors hover:text-primary dark:text-zinc-400 dark:hover:text-rose-300 cursor-pointer flex items-center justify-center gap-1"
                    >
                        ← Back to SSO options
                    </button>
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: '',
    description: '',
};
