declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                pharmacy_id: number;
                email: string;
                role: string;
            };
        }
    }
}

export { };
