import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

// Token retrieval function (runs on client-side)
export const signToken = (username) => {
	const token = jwt.sign({ username }, process.env.JWT_SECRET)
	return token;
}

// Token verification function (runs on server-side)
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.username;
  } catch (error) {
    return null;
  }
};


// Logout function (runs on client-side)
export const logout = () => {
  if (typeof window !== 'undefined') {
    Cookies.remove('token');
  }
}

/*
export const checkExistingUser = async (username)=>{
	await connectToDatabase();
	const existingUser = await User.findOne(username)
	if(existingUser){
		return true
	} else {
		return false
	}
}*/