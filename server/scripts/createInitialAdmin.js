const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createInitialAdmin() {
    try {
        const hashedPassword = await bcrypt.hash('leenock1231', 10);
        
        const admin = await prisma.admin.create({
            data: {
                firstName: 'Enoch',
                lastName: 'mwenda',
                email: 'leenock11@vicarage.com',
                password: hashedPassword,
                role: 'SUPER_ADMIN'
            }
        });

        console.log('Initial admin created successfully:', admin);
    } catch (error) {
        console.error('Error creating initial admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createInitialAdmin(); 