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

// export default (path?: string, options?: boolean) => {
//     const router = useRouter();
//     return router.push(path!)
// }
