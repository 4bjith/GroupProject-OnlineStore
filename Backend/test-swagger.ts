import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Group Project API',
    description: 'API Documentation',
    version: '1.0.0',
  },
  openapi: '3.0.0',
};

const outputFile = './openapi.json';
const endpointsFiles = ['./src/index.ts'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc).then((res: any) => {
  console.log(res ? Object.keys(res) : 'no res');
});
