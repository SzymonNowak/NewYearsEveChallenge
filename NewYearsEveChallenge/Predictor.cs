using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace NewYearsEveChallenge
{
    public class Predictor
    {
        private readonly string predictorDir;
        private readonly string predictorDataPath;
        private readonly string predictorScriptPath;

        public Predictor()
        {
            predictorDir = Path.Join(Directory.GetParent(Directory.GetCurrentDirectory()).FullName, "QuickDraw-master");
            predictorDataPath = Path.Join(predictorDir, "data.csv");
            predictorScriptPath = Path.Join(predictorDir, "dummy.py");
        }
        public void WriteData(List<Cords> cords)
        {
            var content = String.Join("\n", cords.Select(crd => $"{crd.x},{crd.y}"));
            File.WriteAllText(predictorDataPath, content);
        }
        public string Predict()
        {
            try
            {
                Process p1 = new Process();
                p1.StartInfo = new ProcessStartInfo(@"python.exe", predictorScriptPath);
                p1.StartInfo.UseShellExecute = false;
                p1.StartInfo.RedirectStandardOutput = true;
                p1.Start();
                StreamReader reader = p1.StandardOutput;
                string output = reader.ReadToEnd();

                // Write the redirected output to this application's window.
                //Console.WriteLine(output);
                p1.WaitForExit();
                return output;
            }
            catch (Exception ex)
            {
                Console.WriteLine("There is a problem in your Python code: " + ex.Message);
            }
            return string.Empty;
        }
    }
}
