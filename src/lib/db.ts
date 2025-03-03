import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI?.trim();

if (!MONGODB_URI) {
  console.error('环境变量 MONGODB_URI 未设置');
  throw new Error('请在环境变量中设置 MONGODB_URI');
}

let isConnected = false;

async function dbConnect() {
  if (isConnected) {
    console.log('使用现有数据库连接');
    return;
  }

  try {
    console.log('正在连接到 MongoDB...');
    console.log('连接字符串:', (MONGODB_URI as string).replace(/\/\/[^:]+:[^@]+@/, '//****:****@')); // 安全地打印连接字符串
    
    // 添加连接事件监听器
    mongoose.connection.on('connected', () => {
      console.log('Mongoose 已连接到 MongoDB');
      isConnected = true;
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose 连接错误:', {
        error: err,
        message: err.message,
        timestamp: new Date().toISOString()
      });
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose 已断开连接');
      isConnected = false;
    });

    await mongoose.connect(MONGODB_URI as string, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log('MongoDB 连接成功');
  } catch (err: unknown) {
    console.error('MongoDB 连接失败:', {
      error: err,
      message: err instanceof Error ? err.message : '未知错误',
      stack: err instanceof Error ? err.stack : undefined,
      timestamp: new Date().toISOString()
    });
    throw new Error(`MongoDB 连接失败: ${err instanceof Error ? err.message : '未知错误'}`);
  }
}

export default dbConnect; 