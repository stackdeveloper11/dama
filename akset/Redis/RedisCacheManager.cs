using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StackExchange.Redis;
using System.Data.Entity;
using akset.Redis;
using akset.data;
using akset.ViewModel;

namespace akset.Redis
{
    //public class RedisCacheManager : CacheHelper, ICacheManager
    //{
    //    private static IDatabase _db;
    //    private static readonly string host = "178.32.127.89";
    //    private static readonly int port = 10286;

    //    public RedisCacheManager()
    //    {
    //        CreateRedisDB();
    //    }

    //    private static IDatabase CreateRedisDB()
    //    {
    //        if (null == _db)
    //        {
    //            ConfigurationOptions option = new ConfigurationOptions();
    //            option.Ssl = false;
    //            option.AllowAdmin = true;
    //            option.Password = "D98;75I?7r!9;WNbjM1):2ga";
    //            //  option.AbortOnConnectFail = true;
    //            option.EndPoints.Add(host, port);
    //            var connect = ConnectionMultiplexer.Connect(option);
    //            _db = connect.GetDatabase();
    //        }
    //        return _db;
    //    }

    //    public void Clear()
    //    {
    //        var server = _db.Multiplexer.GetServer(host, port);
    //        foreach (var item in server.Keys())
    //            _db.KeyDelete(item);
    //    }

    //    public T Get<T>(string key)
    //    {
    //        var rValue = _db.SetMembers(key);
    //        if (rValue.Length == 0)
    //            return default(T);

    //        var result = Deserialize<T>(rValue.ToStringArray());
    //        return result;
    //    }
   
    //    //public T Geti<T>(string key)
    //    //{
    //    //    var rValue = _db.SetMembers(key);
    //    //    if (rValue.Length == 0)
    //    //        return default(T);

    //    //    var result = Deserializer<T>(rValue.ToStringArray());
    //    //    return result;
    //    //}
    //    public bool IsSet(string key)
    //    {
    //        return _db.KeyExists(key);
    //    }

    //    public bool Remove(string key)
    //    {
    //        return _db.KeyDelete(key);
    //    }

    //    public void RemoveByPattern(string pattern)
    //    {
    //        var server = _db.Multiplexer.GetServer(host, port);
    //        foreach (var item in server.Keys(pattern: "*" + pattern + "*"))
    //            _db.KeyDelete(item);
    //    }

    //    public void Set(string key, object data, int cacheTime)
    //    {
    //        if (data == null)
    //            return;

    //        var entryBytes = Serialize(data);
    //        _db.SetAdd(key, entryBytes);

    //        var expiresIn = TimeSpan.FromMinutes(cacheTime);

    //        if (cacheTime > 0)
    //            _db.KeyExpire(key, expiresIn);
    //    }
    //}
}
