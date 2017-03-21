import Koa            from 'koa';
import koaRequest     from 'koa-http-request';
import { weatherAPI } from './config.js';

const app = new Koa()

app.use(koaRequest({
  dataType: 'json',
}));


app.use(async (ctx, next) => {
	var response = await ctx.get(`http://ip-api.com/json/${ctx.ip}`);

  //check if status fail, try with defaulting to current IP Addess (allows to use localhost)
  if (response.status === 'fail') {
    response = await ctx.get('http://ip-api.com/json');
  }

  ctx.lat  = response.lat;
  ctx.lon  = response.lon;
  ctx.body = `Latitude: ${ctx.lat}\nLongitude: ${ctx.lon}`;
  await next();
});

app.use(async (ctx, next) => {
  var response = await ctx.get(`http://api.openweathermap.org/data/2.5/weather?lat=${ctx.lat}&lon=${ctx.lon}&appid=${weatherAPI}`);
  ctx.weatherData = response;
  await next();
})

app.listen(3000, () => console.log('server started. Vistit localhost:3000 in your browser'))

export default app;
