import { Box } from "@mui/material";

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'background.default',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            {children}
        </Box>
    );
}
