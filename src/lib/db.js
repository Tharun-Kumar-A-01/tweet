import mongoose from 'mongoose';

const connectToDatabase = async () => {
	try{
		if (!mongoose.connections[0].readyState) {
			await mongoose.connect(process.env.MONGODB_URI);
		} else {
		return;
	}
	} catch(error){
		console.log(error);
	}

	
};

export default connectToDatabase;
