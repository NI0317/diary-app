import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI?.trim();

if (!MONGODB_URI) {
  throw new Error('请在环境变量中设置 MONGODB_URI');
}

let isConnected = false;

async function dbConnect() {
  if (isConnected) {
    return;
  }

  try {
    console.log('正在连接到 MongoDB...');
    console.log('连接字符串:', (MONGODB_URI as string).replace(/\/\/[^:]+:[^@]+@/, '//****:****@')); // 安全地打印连接字符串
    
    // 添加连接事件监听器
    mongoose.connection.on('connected', () => {
      console.log('Mongoose 已连接到 MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose 连接错误:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose 已断开连接');
    });

    await mongoose.connect(MONGODB_URI as string, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      retryWrites: true,
      w: 'majority',
      tls: true
    });
    
    isConnected = true;
    console.log('MongoDB 连接成功');
  } catch (err: unknown) {
    console.error('MongoDB 连接失败:', err);
    throw new Error('MongoDB 连接失败');
  }
}

export default dbConnect; 