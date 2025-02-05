"use server";

import { revalidatePath } from "next/cache";
import { ClassSchema, SubjectSchema, TeacherSchema } from "./formValidationSchemas";
import prisma from "./prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { strict } from "assert";
import { string } from "zod";

export const createSubject = async (
  currentState: { success: boolean; error: boolean },
  data: SubjectSchema
) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers:{
            connect:data.teachers.map(teacherId=>({id:teacherId}))
        }
      },
    });
    // revalidatePath("/dashboard/list/subjects");
    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const updateSubject = async (
    currentState: { success: boolean; error: boolean },
    data: SubjectSchema
  ) => {
    
    try {
      await prisma.subject.update({
        where:{
            id:data.id
        },
        data: {
          name: data.name,
          teachers:{
            set:data.teachers.map(teacherId=>({id:teacherId}))
          }
        },
      });
      // revalidatePath("/dashboard/list/subjects");
      return { success: true, error: false };
    } catch (error) {
      console.log(error);
      return { success: false, error: true };
    }
  };

  export const deleteSubject = async (
    currentState: { success: boolean; error: boolean },
    data: FormData
  ) => {
    const id=data.get("id") as string
    try {
      await prisma.subject.delete({
        where:{
            id:parseInt(id)
        }
       
      });
      // revalidatePath("/dashboard/list/subjects");
      return { success: true, error: false };
    } catch (error) {
      console.log(error);
      return { success: false, error: true };
    }
  };

  export const createClass = async (
    currentState: { success: boolean; error: boolean },
    data: ClassSchema
  ) => {
    try {
      await prisma.class.create({
        data
      });
      // revalidatePath("/dashboard/list/subjects");
      return { success: true, error: false };
    } catch (error) {
      console.log(error);
      return { success: false, error: true };
    }
  };
  
  export const updateClass = async (
      currentState: { success: boolean; error: boolean },
      data: ClassSchema
    ) => {
      
      try {
        await prisma.class.update({
          where:{
            id:data.id
          },
          data
        });
        // revalidatePath("/dashboard/list/subjects");
        return { success: true, error: false };
      } catch (error) {
        console.log(error);
        return { success: false, error: true };
      }
    };
  
    export const deleteClass = async (
      currentState: { success: boolean; error: boolean },
      data: FormData
    ) => {
      const id=data.get("id") as string
      try {
        await prisma.class.delete({
          where:{
              id:parseInt(id)
          }
         
        });
        // revalidatePath("/dashboard/list/subjects");
        return { success: true, error: false };
      } catch (error) {
        console.log(error);
        return { success: false, error: true };
      }
    };
  
    export const createTeacher = async (
        currentState: { success: boolean; error: boolean },
        data: TeacherSchema
      ) => {
        try {
            const client = await clerkClient()
            const user =await client.users.createUser({
                username:data.username,
                password:data.password,
                emailAddress:[data.email?data.email:""],
                firstName:data.name,
                lastName:data.surname,
                publicMetadata:{role:"teacher"}
            })
          await prisma.teacher.create({
            data:{
                id:user.id,
                username:data.username,
                name:data.name,
                surname:data.surname,
                email:data.email,
                phone:data.phone,
                address:data.address,
                img:data.img,
                bloodType:data.bloodType,
                sex:data.sex,
                birthday:data.birthday,
                subjects:{
                    connect:data.subjects?.map((subjectId:string)=>({id:parseInt(subjectId)}))
                }

            }
          });
          // revalidatePath("/dashboard/list/subjects");
          return { success: true, error: false };
        } catch (error) {
          console.log(error);
          return { success: false, error: true };
        }
      };
      
      export const updateTeacher = async (
          currentState: { success: boolean; error: boolean },
          data: TeacherSchema
        ) => {
          
          try {
            if(!data.id) return { success: false, error: true };
            const client = await clerkClient()
            const user =await client.users.updateUser(data.id, {
                username:data.username,
                ...(data.password!=="" && {password:data.password}),
                firstName:data.name,
                lastName:data.surname,
            })

            await prisma.teacher.update({
              where:{
                id:data.id
              },
              data:{
                ...(data.password!=="" && {password:data.password}),
                id:user.id,
                username:data.username,
                name:data.name,
                surname:data.surname,
                email:data.email,
                phone:data.phone,
                address:data.address,
                img:data.img,
                bloodType:data.bloodType,
                sex:data.sex,
                birthday:data.birthday,
                subjects:{
                    set:data.subjects?.map((subjectId:string)=>({id:parseInt(subjectId)}))
                },
                


            }
            });
            // revalidatePath("/dashboard/list/subjects");
            return { success: true, error: false };
          } catch (error) {
            console.log(error);
            return { success: false, error: true };
          }
        };
      
        export const deleteTeacher = async (
          currentState: { success: boolean; error: boolean },
          data: FormData
        ) => {
          const id=data.get("id") as string
          try {
            await prisma.teacher.delete({
              where:{
                  id:id
              }
             
            });
            // revalidatePath("/dashboard/list/subjects");
            return { success: true, error: false };
          } catch (error) {
            console.log(error);
            return { success: false, error: true };
          }
        };
      