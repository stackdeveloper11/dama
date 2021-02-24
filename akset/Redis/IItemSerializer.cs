using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace akset.Redis
{
    public interface IItemSerializer
    {
        byte[] Serialize(object item);
        object Deserialize(byte[] itemBytes);
    }
}
