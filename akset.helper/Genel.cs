//using akset.data;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Text;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web.Hosting;
using System.Web.Mvc;
using System.Xml;
using System.Xml.Serialization;
using System.Linq;
using System.Drawing.Imaging;

namespace akset.helper
{
    public static class Genel
    {
        //   public static aksetDB db = new aksetDB();
        public static readonly string PasswordHash = "P@@Sw0rdtt";
        public static readonly string SaltKey = "S@LT&KEYtt";
        public static readonly string VIKey = "@1B2c3D4e5F6g7H8tt";
        public static string str = "";

        //public void ExecuteCommandSync(string command)
        //{




        //    return;

        //}



        //public static void getparent(Kategori cat)
        //{
        //    str += cat.baslik + "[" + cat.baslik + ",";
        //    if (cat.parent != null)
        //    {
        //        getparent(cat.parent);
        //    }
        //    string ggg = "";
        //    //foreach (var item in listtocheck)
        //    //{
        //    //    if (db.Kategoris.Where(a=>a.)) continue;
        //    //    if (item.parent != null)
        //    //    {
        //    //        str += item.adi + ",";
        //    //        getparent(item, aksetDB.Create().Kategoris.ToList());
        //    //    }
        //    //}
        //}
        public static string base64resim(string path)
        {
            string base64String = "";
            using (Image image = Image.FromFile(path))
            {
                using (MemoryStream m = new MemoryStream())
                {
                    image.Save(m, image.RawFormat);
                    byte[] imageBytes = m.ToArray();

                    base64String = Convert.ToBase64String(imageBytes);
                    return "data:image/jpg;base64," + base64String;
                }
            }
        }
        public static string base64video(string path)
        {
            string base64String = "";
            using (FileStream fsRead = new FileStream(path, FileMode.Open))
            {
                int fsLen = (int)fsRead.Length;
                byte[] heByte = new byte[fsLen];
                int r = fsRead.Read(heByte, 0, heByte.Length);

                string base64Str = Convert.ToBase64String(heByte);

                return "data:video/mp4;base64," + base64Str;
            }
        }
        public static string GenerateSlug(this string phrase)
        {
            string str = phrase.RemoveAccent().ToLower();
            // invalid chars           
            str = Regex.Replace(str, @"[^a-z0-9\s-]", "");
            // convert multiple spaces into one space   
            str = Regex.Replace(str, @"\s+", " ").Trim();
            // cut and trim 
            str = str.Substring(0, str.Length <= 45 ? str.Length : 45).Trim();
            str = Regex.Replace(str, @"\s", "-"); // hyphens   
            return str;
        }

        public static string RemoveAccent(this string txt)
        {
            byte[] bytes = System.Text.Encoding.GetEncoding("Cyrillic").GetBytes(txt);
            return System.Text.Encoding.ASCII.GetString(bytes);
        }

        public static string Encrypt(string plainText)
        {
            byte[] plainTextBytes = Encoding.UTF8.GetBytes(plainText);

            byte[] keyBytes = new Rfc2898DeriveBytes(PasswordHash, Encoding.ASCII.GetBytes(SaltKey)).GetBytes(256 / 8);
            var symmetricKey = new RijndaelManaged() { Mode = CipherMode.CBC, Padding = PaddingMode.Zeros };
            var encryptor = symmetricKey.CreateEncryptor(keyBytes, Encoding.ASCII.GetBytes(VIKey));

            byte[] cipherTextBytes;

            using (var memoryStream = new MemoryStream())
            {
                using (var cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write))
                {
                    cryptoStream.Write(plainTextBytes, 0, plainTextBytes.Length);
                    cryptoStream.FlushFinalBlock();
                    cipherTextBytes = memoryStream.ToArray();
                    cryptoStream.Close();
                }
                memoryStream.Close();
            }
            return Convert.ToBase64String(cipherTextBytes);
        }

        public static string Decrypt(string encryptedText)
        {
            byte[] cipherTextBytes = Convert.FromBase64String(encryptedText);
            byte[] keyBytes = new Rfc2898DeriveBytes(PasswordHash, Encoding.ASCII.GetBytes(SaltKey)).GetBytes(256 / 8);
            var symmetricKey = new RijndaelManaged() { Mode = CipherMode.CBC, Padding = PaddingMode.None };

            var decryptor = symmetricKey.CreateDecryptor(keyBytes, Encoding.ASCII.GetBytes(VIKey));
            var memoryStream = new MemoryStream(cipherTextBytes);
            var cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read);
            byte[] plainTextBytes = new byte[cipherTextBytes.Length];

            int decryptedByteCount = cryptoStream.Read(plainTextBytes, 0, plainTextBytes.Length);
            memoryStream.Close();
            cryptoStream.Close();
            return Encoding.UTF8.GetString(plainTextBytes, 0, decryptedByteCount).TrimEnd("\0".ToCharArray());
        }
        public static string fileInfo(string path)
        {
            FileInfo info = new FileInfo(path);
            long length = info.Length / 1024;
            return length.ToString();
        }
        public static void resizeImage(string path,Image img, int canvasWidth, int canvasHeight)
        {
            Image image = img;// Image.FromFile(path + originalFilename);
            Image thumbnail = new Bitmap(canvasWidth, canvasHeight); // changed parm names
            Graphics graphic = Graphics.FromImage(thumbnail);
            graphic.InterpolationMode = InterpolationMode.HighQualityBicubic;
            graphic.SmoothingMode = SmoothingMode.HighQuality;
            graphic.PixelOffsetMode = PixelOffsetMode.HighQuality;
            graphic.CompositingQuality = CompositingQuality.HighQuality;
            /* ------------------ new code --------------- */
            // Figure out the ratio
            double ratioX = (double)canvasWidth / (double)img.Width;
            double ratioY = (double)canvasHeight / (double)img.Height;
            // use whichever multiplier is smaller
            double ratio = ratioX < ratioY ? ratioX : ratioY;
            // now we can get the new height and width
            int newHeight = Convert.ToInt32(img.Height * ratio);
            int newWidth = Convert.ToInt32(img.Width * ratio);
            // Now calculate the X,Y position of the upper-left corner 
            // (one of these will always be zero)
            int posX = Convert.ToInt32((canvasWidth - (img.Width * ratio)) / 2);
            int posY = Convert.ToInt32((canvasHeight - (img.Height * ratio)) / 2);

            graphic.Clear(Color.White); // white padding
            graphic.DrawImage(image, posX, posY, newWidth, newHeight);

            /* ------------- end new code ---------------- */

            ImageCodecInfo[] info = ImageCodecInfo.GetImageEncoders();
            EncoderParameters encoderParameters;
            encoderParameters = new EncoderParameters(1);
            encoderParameters.Param[0] = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality,85L);
            thumbnail.Save(path, info[1], encoderParameters);
        }
        public static Bitmap ScaleImage(Image image, int maxWidth, int maxHeight)
        {
            var ratioX = (double)maxWidth / image.Width;
            var ratioY = (double)maxHeight / image.Height;
            var ratio = Math.Min(ratioX, ratioY);

            var newWidth = (int)(image.Width * ratio);
            var newHeight = (int)(image.Height * ratio);

            var newImage = new Bitmap(maxWidth, maxHeight);
            newImage.SetResolution(72, 72);
            using (var graphics = Graphics.FromImage(newImage))
            {
                // Calculate x and y which center the image
                int y = (maxHeight / 2) - newHeight / 2;
                int x = (maxWidth / 2) - newWidth / 2;
                graphics.Clear(Color.White);
                graphics.CompositingQuality = CompositingQuality.HighQuality;
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                graphics.SmoothingMode = SmoothingMode.HighQuality;
                graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
                // Draw image on x and y with newWidth and newHeight
                graphics.DrawImage(image, x, y, newWidth, newHeight);
                graphics.Dispose();
            }
            return newImage;
        }
        //http://stackoverflow.com/questions/11137979/image-resizing-using-c-sharp
        public static Bitmap Resize(Image image, int width, int height)
        {
            var destRect = new Rectangle(0, 0, width, height);
            var destImage = new Bitmap(width, height);
            destImage.SetResolution(image.HorizontalResolution, image.VerticalResolution);
            using (var graphics = Graphics.FromImage(destImage))
            {
                graphics.CompositingMode = CompositingMode.SourceCopy;
                graphics.CompositingQuality = CompositingQuality.HighQuality;
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                graphics.SmoothingMode = SmoothingMode.HighQuality;
                graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
                using (var wrapMode = new ImageAttributes())
                {
                    wrapMode.SetWrapMode(WrapMode.TileFlipXY);
                    graphics.DrawImage(image, destRect, 0, 0, image.Width, image.Height, GraphicsUnit.Pixel, wrapMode);
                }
            }
            return destImage;
        }

        private static Random random = new Random();
        public static string RandomString(int length)
        {
            const string chars = "0123456789ABCDEFGHJKLMNPRSTUVYWXZ";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }
        public static void DeleteDirectory(string target_dir)
        {
            string[] files = Directory.GetFiles(target_dir);
            string[] dirs = Directory.GetDirectories(target_dir);

            foreach (string file in files)
            {
                File.SetAttributes(file, FileAttributes.Normal);
                File.Delete(file);
            }

            foreach (string dir in dirs)
            {
                DeleteDirectory(dir);
            }

            Directory.Delete(target_dir, false);
        }
        public static string RandomStringNumber2(int length)
        {
            const string chars = "ABCDEFGHKLMNPR";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }
        public static string ConvertStringToHex(string asciiString)
        {
            string hex = "";
            foreach (char c in asciiString)
            {
                int tmp = c;
                hex += String.Format("{0:x2}", (uint)Convert.ToUInt32(tmp.ToString()));
            }
            return hex;
        }
        public static string ConvertHexToString(string HexValue)
        {
            string StrValue = "";
            while (HexValue.Length > 0)
            {
                StrValue += Convert.ToChar(Convert.ToUInt32(HexValue.Substring(0, 2), 16)).ToString();
                HexValue = HexValue.Substring(2, HexValue.Length - 2);
            }
            return StrValue;
        }
        public enum ImageFormat
        {
            //bmp,
            jpeg,
            //gif,
            //tiff,
            //png,
            unknown
        }
        public static string tcnodog(string tcNo)
        {
            int toplam = 0; int toplam2 = 0; int toplam3 = 0;
            string durum = "Dogru";
            if (tcNo.Length == 11)
            {
                if (Convert.ToInt32(tcNo[0].ToString()) != 0) //tc kimlik numaranın ilk hanesi 0 değilse
                {
                    for (int i = 0; i < 10; i++)
                    {
                        toplam = toplam + Convert.ToInt32(tcNo[i].ToString());
                        if (i % 2 == 0)
                        {
                            if (i != 10)
                            {
                                toplam2 = toplam2 + Convert.ToInt32(tcNo[i].ToString()); // 7 ile çarpılacak sayıları topluyoruz
                            }

                        }
                        else
                        {
                            if (i != 9)
                            {
                                toplam3 = toplam3 + Convert.ToInt32(tcNo[i].ToString());
                            }
                        }
                    }
                }
                else
                {
                    durum = ("Tc Kimlik Numaranızın ilk hanesi 0 olamaz.");
                }
            }
            else
            {
                durum = ("Tc Kimlik Numarınız 11 haneli olmak zorunda.Eksik ya da fazla değer girdiniz.");
            }
            if (((toplam2 * 7) - toplam3) % 10 == Convert.ToInt32(tcNo[9].ToString()) && toplam % 10 == Convert.ToInt32(tcNo[10].ToString()))
            {
                durum = ("Dogru");
            }
            else
            {
                durum = ("Tc Kimlik Numarası Yanlış!");
            }

            return durum;
        }

        public static string CaptchaImage(out int son, bool noisy = true)
        {
            var rand = new Random((int)DateTime.Now.Ticks);
            //generate new question 
            int a = rand.Next(10, 99);
            int b = rand.Next(0, 9);
            var captcha = string.Format("{0} + {1} = ?", a, b);

            //store answer 
            son = a + b;

            //image stream 
            //   FileContentResult img = null;
            string gg = "";
            using (var mem = new MemoryStream())
            using (var bmp = new Bitmap(130, 30))
            using (var gfx = Graphics.FromImage((Image)bmp))
            {
                gfx.TextRenderingHint = TextRenderingHint.ClearTypeGridFit;
                gfx.SmoothingMode = SmoothingMode.AntiAlias;
                gfx.FillRectangle(Brushes.White, new Rectangle(0, 0, bmp.Width, bmp.Height));
                //add noise 
                if (noisy)
                {
                    int i, r, x, y;
                    var pen = new Pen(Color.Yellow);
                    for (i = 1; i < 10; i++)
                    {
                        pen.Color = Color.FromArgb(
                        (rand.Next(0, 255)),
                        (rand.Next(0, 255)),
                        (rand.Next(0, 255)));

                        r = rand.Next(0, (130 / 3));
                        x = rand.Next(0, 130);
                        y = rand.Next(0, 30);

                        gfx.DrawEllipse(pen, x - r, y - r, r, r);
                    }
                }
                //add question 
                gfx.DrawString(captcha, new Font("Tahoma", 15), Brushes.Gray, 2, 3);
                //render as Jpeg 
                bmp.Save(mem, System.Drawing.Imaging.ImageFormat.Jpeg);
                // img = this.File(mem.GetBuffer(), "image/Jpeg");
                gg = ImageToBase64(bmp, System.Drawing.Imaging.ImageFormat.Jpeg);
            }
            return gg;
        }
        public static string ImageToBase64(Image image, System.Drawing.Imaging.ImageFormat format)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                // Convert Image to byte[]
                image.Save(ms, format);
                byte[] imageBytes = ms.ToArray();
                // Convert byte[] to Base64 String
                string base64String = Convert.ToBase64String(imageBytes);
                return base64String;
            }
        }
        public static string bagajyazdir(string unit)
        {

            string sonuc = "bos";
            if (unit.Contains("N"))
            {
                if (unit.Contains("-1"))
                {
                    sonuc = "0 KG";
                }
                else
                {
                    sonuc = "20" + "KG";
                }
                if (unit.Contains("0N"))
                {
                    sonuc = "Sadece El Bagajı";
                }
            }
            if (unit.Contains("K"))
            {
                sonuc = (Convert.ToInt32(unit.Substring(0, 1)) * 10) + "KG";
            }
            return sonuc;
        }
        public static string GetIPAddress()
        {
            IPHostEntry Host = default(IPHostEntry);
            string IPAddress = "";
            string Hostname = null;
            Hostname = System.Environment.MachineName;
            Host = Dns.GetHostEntry(Hostname);
            foreach (IPAddress IP in Host.AddressList)
            {
                if (IP.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
                {
                    IPAddress = Convert.ToString(IP);
                }
            }
            return IPAddress;
        }
        public static int RandomNumber(int min, int max)
        {
            Random random = new Random();
            return random.Next(min, max);
        }

        // Generate a random string with a given size    
        public static string RandomString(int size, bool lowerCase)
        {
            StringBuilder builder = new StringBuilder();
            Random random = new Random();
            char ch;
            for (int i = 0; i < size; i++)
            {
                ch = Convert.ToChar(Convert.ToInt32(Math.Floor(26 * random.NextDouble() + 65)));
                builder.Append(ch);
            }
            if (lowerCase)
                return builder.ToString().ToLower();
            return builder.ToString();
        }

        // Generate a random password    
        public static string RandomPassword()
        {
            StringBuilder builder = new StringBuilder();
            builder.Append(RandomString(4, true));
            builder.Append(RandomNumber(1000, 9999));
            builder.Append(RandomString(2, false));
            return builder.ToString();
        }
        public static string trle(string txtMesaj)
        {

            string yazi = txtMesaj;
            yazi = yazi.Replace("ü", "u"); //yazi= yazi.Replace("eski değer","yeni değer") anlamına gelir.Yani yazi değişkenindeki eski değer ile yeni değiştirip tekrardan yazi değişkenime yeni değerimi atıyorum
            yazi = yazi.Replace("ı", "i");
            yazi = yazi.Replace("ö", "o");
            yazi = yazi.Replace("ü", "u");
            yazi = yazi.Replace("ş", "s");
            yazi = yazi.Replace("ğ", "g");
            yazi = yazi.Replace("ç", "c");
            yazi = yazi.Replace("Ü", "U");
            yazi = yazi.Replace("İ", "I");
            yazi = yazi.Replace("Ö", "O");
            yazi = yazi.Replace("Ü", "U");
            yazi = yazi.Replace("Ş", "S");
            yazi = yazi.Replace("Ğ", "G");
            yazi = yazi.Replace("Ç", "C");

            return yazi;
        }
        public static string smsyolla2(string soyad, string msj, string tel)
        {
            string xml = "<SMS><dogrulama><kullanici>artasyapi</kullanici><parola>SHRshr1912</parola></dogrulama><mesajiniz><baslik>SelmaHanim</baslik><metin>Sayin " + soyad + ", " + msj + "</metin><alicilar><gsm>" + tel + "</gsm></alicilar></mesajiniz></SMS>";

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://www.kobikom.com/api/sendsms/xml/");
            byte[] bytes;
            bytes = System.Text.Encoding.ASCII.GetBytes(xml);
            request.ContentType = "application/xml Accept: */*";
            request.ContentLength = bytes.Length;
            request.Method = "POST";
            request.Host = "kobikom.com";
            Stream requestStream = request.GetRequestStream();
            requestStream.Write(bytes, 0, bytes.Length);
            requestStream.Close();
            HttpWebResponse response;
            response = (HttpWebResponse)request.GetResponse();
            if (response.StatusCode == HttpStatusCode.OK)
            {
                Stream responseStream = response.GetResponseStream();
                string responseStr = new StreamReader(responseStream).ReadToEnd();
                return responseStr;
            }
            return null;
        }
        public static string mailyolla(string bsl, string maili, string isim, string mail)
        {


            var template = System.IO.File.ReadAllText(HostingEnvironment.MapPath("~/mailtemplate/noreplay.html"));
            template = string.Format(template, "noreplay", "Bilgilendirme", maili + "<br/> ", isim.ToUpper());

            // hayvansatisdb.Create().Users.Where(a => a.Id == usr).FirstOrDefault().Email;
            MailMessage MyMailer = new MailMessage();
            MyMailer.Bcc.Add(mail);
            MyMailer.From = new MailAddress("noreplay@alobilet724.com", "Bildirim");
            MyMailer.Subject = bsl;
            MyMailer.Body = template;
            MyMailer.IsBodyHtml = true;
            //    MyMailer.Priority = MailPriority.High;
            SmtpClient client = new SmtpClient("mail.alobilet724.com", 587);

            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            client.UseDefaultCredentials = false;
            client.Credentials = new NetworkCredential("noreplay@alobilet724.com", "12121212aA!!");
            client.Send(MyMailer);

            return "ok";
        }

        public static string smsyolla(string soyad, string msj, string tel)
        {//27.Eyl 23:50
            string xml = "<SMS><dogrulama><kullanici>artasyapi</kullanici><parola>Sihir1912</parola></dogrulama><mesajiniz><baslik>AloBilet724</baslik><metin>Sn " + soyad + "," + msj + " www.alobilet724.com 08504660724</metin><alicilar><gsm>" + tel + "</gsm></alicilar></mesajiniz></SMS>";

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://www.kobikom.com/api/sendsms/xml/");
            byte[] bytes;
            bytes = System.Text.Encoding.ASCII.GetBytes(xml);
            request.ContentType = "application/xml Accept: */*";
            request.ContentLength = bytes.Length;
            request.Method = "POST";
            request.Host = "kobikom.com";
            Stream requestStream = request.GetRequestStream();
            requestStream.Write(bytes, 0, bytes.Length);
            requestStream.Close();
            HttpWebResponse response;
            response = (HttpWebResponse)request.GetResponse();
            if (response.StatusCode == HttpStatusCode.OK)
            {
                Stream responseStream = response.GetResponseStream();
                string responseStr = new StreamReader(responseStream).ReadToEnd();
                return responseStr;
            }
            return null;
        }

        public static string URLFriendly(string title)
        {
            title = title.Trim();
            title = Regex.Replace(title, "ş", "s");
            title = Regex.Replace(title, "ı", "i");
            title = Regex.Replace(title, "ö", "o");
            title = Regex.Replace(title, "ü", "u");
            title = Regex.Replace(title, "ç", "c");
            title = Regex.Replace(title, "ğ", "g");
            title = Regex.Replace(title, "Ş", "S");
            title = Regex.Replace(title, "İ", "I");
            title = Regex.Replace(title, "Ö", "O");
            title = Regex.Replace(title, "Ü", "U");
            title = Regex.Replace(title, "Ç", "C");
            title = Regex.Replace(title, "Ğ", "G");
            title = Regex.Replace(title, @"[^a-zA-Z0-9]", " ");
            title = Regex.Replace(title, @"\s+", " ");
            title = title.Trim();
            title = Regex.Replace(title, " ", "-");
            return title;
        }

        public static ImageFormat GetImageFormat(byte[] bytes)
        {
            // see http://www.mikekunz.com/image_file_header.html  
            //var bmp = Encoding.ASCII.GetBytes("BM");     // BMP
            //var gif = Encoding.ASCII.GetBytes("GIF");    // GIF
            //var png = new byte[] { 137, 80, 78, 71 };    // PNG
            //var tiff = new byte[] { 73, 73, 42 };         // TIFF
            //var tiff2 = new byte[] { 77, 77, 42 };         // TIFF
            var jpeg = new byte[] { 255, 216 }; // jpeg
                                                //  var jpeg2 = new byte[] { 255, 216, 255, 225 }; // jpeg canon

            //if (bmp.SequenceEqual(bytes.Take(bmp.Length)))
            //    return ImageFormat.bmp;

            //if (gif.SequenceEqual(bytes.Take(gif.Length)))
            //    return ImageFormat.gif;

            //if (png.SequenceEqual(bytes.Take(png.Length)))
            //    return ImageFormat.png;

            //if (tiff.SequenceEqual(bytes.Take(tiff.Length)))
            //    return ImageFormat.tiff;

            //if (tiff2.SequenceEqual(bytes.Take(tiff2.Length)))
            //    return ImageFormat.tiff;

            if (jpeg.SequenceEqual(bytes.Take(jpeg.Length)))
                return ImageFormat.jpeg;

            //if (jpeg2.SequenceEqual(bytes.Take(jpeg2.Length)))
            //    return ImageFormat.jpeg;

            return ImageFormat.unknown;
        }
    }
}
