import { useRouter, usePathname } from 'next/navigation';

export default (path?: string, replace?: boolean) => {
    const router = useRouter();
    let useNavigate = () => {
        return {
            router: useRouter(),
            pathname: usePathname(),
            navigate: () => {
                router.push(path!);
            },
        };
    };
    return useNavigate();
};
