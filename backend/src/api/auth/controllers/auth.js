const prisma = require('../../../../prisma');
const { comparePasswords } = require('../../../../utils/authUtils');

exports.loginUser = async (req, res) => {
    const { userId, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { user_id: userId } });

        if (!user) {
            return res.status(401).json({ status: 401, message: 'Invalid userId or password' });
        }

        const isMatch = await comparePasswords(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ status: 401, message: 'Invalid userId or password' });
        }

        req.session.user = {
            id: user.id,
            userId: user.user_id,
        };

        return res.status(200).json({
            status: 200,
            message: 'Login successful',
            user: {
                id: user.id,
                userId: user.user_id,
            }
        });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Something went wrong' });
    }
};

exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ status: 500, message: 'Failed to logout' });
        }
        res.status(200).json({ status: 200, message: 'Logout successful' });
    });
};
