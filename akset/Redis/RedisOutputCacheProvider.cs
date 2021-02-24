using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Caching;
using StackExchange.Redis;
using System.IO;
using System.Diagnostics;
namespace akset.Redis
{
    //public class RedisOutputCacheProvider : OutputCacheProvider
    //{
    //    private static ConnectionMultiplexer Redis;
    //    private static IItemSerializer Serializer;
    //    private static readonly string host = "178.32.127.89";
    //    private static readonly int port = 10286;
    //    static RedisOutputCacheProvider()
    //    {
    //        ConfigurationOptions option = new ConfigurationOptions();
    //        option.Ssl = false;
    //        option.AllowAdmin = true;
    //        option.Password = "D98;75I?7r!9;WNbjM1):2ga";
    //        //  option.AbortOnConnectFail = true;
    //        option.EndPoints.Add(host, port);
    //        Redis = ConnectionMultiplexer.Connect(option);

    //       Serializer = new BinaryFormatterItemSerializer();
    //        // Serializer = new ProtoBufItemSerializer();
    //    }

    //    public override object Add(string key, object entry, DateTime utcExpiry)
    //    {
    //        try
    //        {
    //            // return the existing value if any
    //            var existingValue = Get(key);
    //            if (existingValue != null)
    //            {
    //                return existingValue;
    //            }

    //            var expiration = utcExpiry - DateTime.UtcNow;
    //            var entryBytes = Serializer.Serialize(entry);

    //            var db = Redis.GetDatabase();

    //            // set the cache item with the defined expiration, only if an item does not exist
    //            db.StringSet(key, entryBytes, expiration, When.NotExists);

    //            return entry;
    //        }
    //        catch (RedisConnectionException e)
    //        {
    //            Trace.TraceError(e.ToString());
    //            return null;
    //        }
    //    }

    //    public override void Set(string key, object entry, DateTime utcExpiry)
    //    {
    //        try
    //        {
    //            var expiration = utcExpiry - DateTime.UtcNow;
    //            var entryBytes = Serializer.Serialize(entry);

    //            var db = Redis.GetDatabase();

    //            // set the cache item with the defined expiration, overriding existing items
    //            db.StringSet(key, entryBytes, expiration, When.Always);
    //        }
    //        catch (RedisConnectionException e)
    //        {
    //            Trace.TraceError(e.ToString());
    //        }
    //    }

    //    public override object Get(string key)
    //    {
    //        try
    //        {
    //            var db = Redis.GetDatabase();

    //            var valueBytes = db.StringGet(key);

    //            if (!valueBytes.HasValue)
    //            {
    //                return null;
    //            }

    //            var value = Serializer.Deserialize(valueBytes);

    //            return value;
    //        }
    //        catch (RedisConnectionException e)
    //        {
    //            Trace.TraceError(e.ToString());
    //            return null;
    //        }
    //    }

    //    public override void Remove(string key)
    //    {
    //        try
    //        {
    //            var db = Redis.GetDatabase();

    //            // signal key removal but don't wait for the result
    //            db.KeyDelete(key);
    //        }
    //        catch (RedisConnectionException e)
    //        {
    //            Trace.TraceError(e.ToString());
    //        }
    //    }
    //}
}
