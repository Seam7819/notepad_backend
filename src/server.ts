import app from "./app";
import { prisma } from "./lib/prisma";


const PORT = process.env.PORT || 5000;
async function main () {
    try{
        await prisma.$connect();
        console.log('prisma connected successfully');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }catch(err) {
        console.error('Error occurred:', err);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main()