﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NewYearsEveChallenge
{
    public class Predictor
    {
        private const string ScriptName = "QuickDrawApp.py";
        private const string DataFileName = "data.csv";
        private const string OutputFileName = "result.txt";
        private readonly string predictorDir;
        private readonly string predictorDataPath;
        private readonly string predictorOutputPath;
        private readonly string predictorScriptPath;

        public Predictor()
        {
            predictorDir = Path.Join(Directory.GetParent(Directory.GetCurrentDirectory()).FullName, "QuickDraw-master");
            predictorDataPath = Path.Join(predictorDir, DataFileName);
            predictorOutputPath = Path.Join(predictorDir, OutputFileName);
            predictorScriptPath = Path.Join(predictorDir, ScriptName);
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
                run_cmd(predictorScriptPath);
                //Process p1 = new Process();
                //p1.StartInfo = new ProcessStartInfo(@"python.exe", predictorScriptPath);
                //p1.StartInfo.UseShellExecute = true;
                //p1.Start();
                //p1.WaitForExit();
                string output = File.ReadAllText(predictorOutputPath, Encoding.UTF8);
                return output;//.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.None).LastOrDefault();
            }
            catch (Exception ex)
            {
                Console.WriteLine("There is a problem in your Python code: " + ex.Message);
            }
            return string.Empty;
        }

        public void run_cmd(string args)
        {
            ProcessStartInfo start = new ProcessStartInfo();
            start.FileName = @"C:\Users\krile\AppData\Local\Programs\Python\Python37\python.exe";
            start.Arguments = string.Format("\"{0}\"", args);
            start.UseShellExecute = false;// Do not use OS shell
            start.WorkingDirectory = predictorDir;
            start.CreateNoWindow = true; // We don't need new window
            start.RedirectStandardOutput = true;// Any output, generated by application will be redirected back
            start.RedirectStandardError = true; // Any error in standard output will be redirected back (for example exceptions)
            Process.Start(start)
                .WaitForExit();
        }
    }
}
