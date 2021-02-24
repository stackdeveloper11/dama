using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Serialization;

namespace akset
{
    public static class ExtensionMethods
    {
        /// <summary>
        /// Converts given class to XML using xml serialization
        /// </summary>
        /// <typeparam name="T">Type of Class</typeparam>
        /// <param name="classObject">Class to be serialized</param>
        /// <returns>Xml string</returns>
        public static string ToXML<T>(this T classObject) where T : class
        {
            XmlSerializer xmls = new XmlSerializer(typeof(T));
            using (MemoryStream ms = new MemoryStream())
            {
                XmlWriterSettings settings = new XmlWriterSettings();
                settings.Encoding = new UTF8Encoding(false);
                settings.Indent = true;
                settings.IndentChars = "\t";
                settings.NewLineChars = Environment.NewLine;
                settings.OmitXmlDeclaration = true;
                settings.ConformanceLevel = ConformanceLevel.Document;
                using (XmlWriter writer = XmlTextWriter.Create(ms, settings))
                {
                    xmls.Serialize(writer, classObject);
                }

                string xml = Encoding.UTF8.GetString(ms.ToArray());
                return xml;
            }
        }
    public static string TohXML<T>(this T classObject) where T : class
        {
            XmlSerializer xsSubmit = new XmlSerializer(typeof(T));
            
            var xml = "";

            using (var sww = new StringWriter())
            {
                using (XmlWriter writer = XmlWriter.Create(sww))
                {
                    xsSubmit.Serialize(writer, classObject);
                    xml = sww.ToString(); // Your XML
                }
            }
            return xml;
        }

        /// <summary>
        /// Converts given XML string to class of type T
        /// </summary>
        /// <typeparam name="T">Type to be converted</typeparam>
        /// <param name="XmlData">xml string</param>
        /// <returns>class of Type T</returns>
        public static T ToClass<T>(this string XmlData)
        {
            XmlSerializer serializer = new XmlSerializer(typeof(T));
            T newClass;
            using (XmlTextReader reader = new XmlTextReader(new StringReader(XmlData)))
            {
          //      reader.Namespaces = false;
                newClass = (T)serializer.Deserialize(reader);
            }
            return newClass;
        }
        public static T TohClass<T>(this string data)
        {
            var response = default(T);

            if (!string.IsNullOrEmpty(data))
            {
                var settings = new XmlReaderSettings() { IgnoreWhitespace = true };
                var serializer = jjCreate(typeof(T));
                var reader = XmlReader.Create(new StringReader(data), settings);
                response = (T)Convert.ChangeType(serializer.Deserialize(reader), typeof(T));
            }
            return response;
        }
        public static Dictionary<Type, XmlSerializer> cache = new Dictionary<Type, XmlSerializer>();

        private static object SyncRootCache = new object();

        public static XmlSerializer jjCreate(Type type)
        {
            XmlSerializer serializer;

            lock (SyncRootCache)
                if (cache.TryGetValue(type, out serializer))
                    return serializer;

            lock (type) //multiple variable of type of one type is same instance
            {
                //constructor XmlSerializer.FromTypes does not throw the first chance exception           
                serializer = XmlSerializer.FromTypes(new[] { type })[0];
                //serializer = XmlSerializerFactoryNoThrow.Create(type);
            }

            lock (SyncRootCache) cache[type] = serializer;
            return serializer;
        }
        public static string InnerXML(this XElement el)
        {
            var reader = el.CreateReader();
            reader.MoveToContent();
            return reader.ReadInnerXml();
        }
    }
}
